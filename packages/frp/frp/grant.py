from frp.matcher import Matcher
from frp.analysis import Analysis
import pandas as pd


class GrantAnalysis(Analysis):
    """
    Handles the cleaning and matching of MyCV grant data
    to FRP
    """
    def __init__(self, matcher: Matcher, config: dict):
        super().__init__(matcher, config)

    def _standardize(self, df: pd.DataFrame) -> pd.DataFrame:
        # TODO: May have to convert between a few different column names
        # ie) "Title or Chapter title" may not always be present
        columns_of_interest = {
            'Reporting date 1': 'string',
            'Total Anticipated Amount OR Total Requested Amount amount': 'float',
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
        # Base filtering based on date
        df = super()._filter(df, year)

        # Keep only funded and awarded grants
        df = df[df['Status'] == 'Awarded']
        return df

    def _augment(self, df: pd.DataFrame) -> pd.DataFrame:
        return df
