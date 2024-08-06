from frp.matcher import Matcher
from frp.analysis import Analysis, ColumnConversion
import pandas as pd


class GrantAnalysis(Analysis):
    """
    Handles the cleaning and matching of MyCV grant data
    to FRP
    """
    def __init__(self, matcher: Matcher, config: dict):
        columns = [
            ColumnConversion('ReportingDate', 'string', ['Reporting date 1']),
            ColumnConversion('Title', 'string', ['Award Title OR Proposal Title']),
            ColumnConversion('Amount', 'float', ['Total Anticipated Amount OR Total Requested Amount amount']),
            ColumnConversion('Status', 'string', ['Status'])
        ]

        super().__init__(matcher, config, columns)

    def _standardize(self, df: pd.DataFrame) -> pd.DataFrame:
        # Handle the datetime formatting
        df['ReportingDate'] = pd.to_datetime(df['ReportingDate'], format='%d/%m/%Y')

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
