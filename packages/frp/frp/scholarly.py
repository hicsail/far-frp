import pandas as pd
from frp.matcher import Matcher
import os
import re
import requests
from frp.analysis import Analysis, ColumnConversion


class FRPScholarlyAnalysis(Analysis):
    """
    Handles the cleaning and matching of MyCV CSVs to FRPs
    """
    def __init__(self, matcher: Matcher, config: dict):
        columns = [
            ColumnConversion('ReportingDate', 'string', ['Reporting date 1']),
            ColumnConversion('Title', 'string', ['Title OR Chapter title']),
            ColumnConversion('WorkType', 'string', ['Scholarly & creative work type']),
            ColumnConversion('Authors', 'string', ['Authors OR Patent owners OR Presenters']),
            ColumnConversion('Journal', 'string', ['Canonical journal title'])
        ]

        super().__init__(matcher, config, columns)

    def _standardize(self, df: pd.DataFrame) -> pd.DataFrame:
        # Handle the datetime formatting
        df['ReportingDate'] = pd.to_datetime(df['ReportingDate'], format='%d/%m/%Y')

        # Return the dataframe of interest
        return df

    def _filter(self, df: pd.DataFrame, year: int) -> pd.DataFrame:
        """
        Filter the dataframe for only the rows that match the
        requirements. This includes removing duplicates or
        """
        # Base filtering based on year
        df = super()._filter(df, year)

        # Only keep the 'scholarly articles' and 'conference papers'
        df = df[(df['WorkType'] == 'Scholarly article') | (df['WorkType'] == 'Conference paper (Published)')]
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
            title = row['Title']
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
