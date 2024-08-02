from frp.matcher import Matcher
import pandas as pd
from pathlib import Path


class GrantAnalysis:
    """
    Handles the cleaning and matching of MyCV grant data
    to FRP
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
        # TODO: May have to convert between a few different column names
        # ie) "Title or Chapter title" may not always be present
        columns_of_interest = {
            'Reporting date 1': 'string',
            'Total Anticipated Amount OR Total Requested Amount amount': 'string',
            'Sponsor Name': 'string',
            'Sponsor Type': 'string',
            'Status': 'string',
            'Award Title OR Proposal Title': 'string',
            'Prime Sponsor Name': 'string',
            'Source': 'string'
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
        # Filter for everything on the current year or later
        df = df[df['Reporting date 1'].dt.year >= year]
        df = df[(df['Status'] == 'Funded') | (df['Status'] == 'Awarded')]
        return df

    def _augment(self, df: pd.DataFrame) -> pd.DataFrame:
        return df

    def _match(self, df: pd.DataFrame, frp_title: str) -> pd.DataFrame:
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
