from pathlib import Path
import pandas as pd
from frp.matcher import Matcher
import os
import re
import requests


class FRPScholarlyAnalysis:
    """
    Handles the cleaning and matching of MyCV CSVs to FRPs
    """
    def __init__(self, matcher: Matcher, config: dict):
        self._matcher = matcher

        # Getting the mapping between columns and inputs
        # to the matcher
        # The mapping is between parameters in the matching
        # to what they are referred to within the DataFrame.
        # ex) publication_title: 'Title OR Chapter title'
        self._mappings = config['matcher']['mappings']

    def _load(self, csv_location: Path) -> pd.DataFrame:
        """
        Read in the dataframe from the CSV. Does not additional
        processing
        """
        return pd.read_csv(csv_location)

    def _standardize(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Handles taking the data frame loaded in from `load` and
        handles making the columns have a standard name and standard
        type
        """
        # TODO: May have to convert between a few different column names
        # ie) "Title or Chapter title" may not always be present
        columns_of_interest = {
            'Reporting date 1': 'string',
            'Scholarly & creative work type': 'string',
            'Authors OR Patent owners OR Presenters': 'string',
            'URL OR Author URL': 'string',
            'DOI': 'string',
            'Funding': 'string',
            'Published proceedings OR Journal': 'string',
            'Conference name OR Presented at OR Meeting or conference': 'string',
            'Status': 'string',
            'Publisher': 'string',
            'Publication date OR Date awarded OR Presentation date': 'datetime64[ns]',
            'Title OR Chapter title': 'string',
            'Sub types': 'string',
            'Canonical journal title': 'string'
        }

        # Get only the columns we care about
        df = df[columns_of_interest.keys()]

        # Convert the columns into the proper types
        df = df.astype(columns_of_interest)

        # Handle the datetime formatting
        df['Reporting date 1'] = pd.to_datetime(df['Reporting date 1'], format='%d/%m/%Y')

        # Return the dataframe of interest
        return df

    def _filter(self, df: pd.DataFrame, year: int) -> pd.DataFrame:
        """
        Filter the dataframe for only the rows that match the
        requirements. This includes removing duplicates or
        """
        # Filter for everything on the current year or later
        df = df[df['Reporting date 1'].dt.year >= year]
        df = df[(df['Scholarly & creative work type'] == 'Scholarly article') | (df['Scholarly & creative work type'] == 'Conference paper (Published)')]
        return df

    def _augment(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Add additional information to the dataframe which
        will allow for improved matching
        """
        # add new empty column to the df
        df['Abstract'] = ''
        # demension api requires escaping all special characters
        pattern = r'([\^":~\\\[\]\{\}\(\)!|&\+])'

        login = {
            'key': os.getenv('DIMENSIONS_API_KEY'),
        }
        resp = requests.post('https://app.dimensions.ai/api/auth', json=login)
        resp.raise_for_status()
        token = resp.json()['token']

        for index, row in df.iterrows():
            title = row['Title OR Chapter title']
            # apply pattern to escape special characters
            title = re.sub(pattern, r'\\\1', title)

            headers = {
                'Authorization': "JWT " + token
            }

            try:
                resp = requests.post(
                    'https://app.dimensions.ai/api/dsl/v2',
                    data=f'search publications in title_abstract_only for "{title}" return publications[abstract] limit 1',
                    headers=headers
                )

                abstract = resp.json().get('publications')[0]['abstract'].replace('\n', ' ')
                df.at[index, 'Abstract'] = abstract
            except Exception:
                print(f'Failed to fetch data for {title}')
                continue

        return df

    def _match(self, df: pd.DataFrame, frp_title: str) -> pd.DataFrame:
        """
        Handles running the FRP title matching against the rows
        of the dataframe
        """
        # Function which is applied to every row in the dataframe
        def apply_matcher(row: pd.Series) -> pd.Series:
            # First get all shared mappings
            mapping = {
                'frp_title': frp_title
            }

            # Then, add in the values from the row as defined in the
            # config
            for key, value in self._mappings.items():
                mapping[key] = row[value]

            return pd.Series(self._matcher.match(mapping))

        # Make a copy of the data any apply the matching row-by-row
        matches = df.copy()
        matches['Part of FRP'] = True
        matches['Part of FRP'] = matches.apply(apply_matcher, axis=1)
        return matches

    def run_frp_analysis(self, csv_location: Path, frp_title: str, year: int) -> pd.DataFrame:
        df = self._load(csv_location)
        df = self._standardize(df)
        df = self._filter(df, year)
        df = self._augment(df)
        df = self._match(df, frp_title)
        return df
