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
        return df

    def _filter(self, df: pd.DataFrame, year: int) -> pd.DataFrame:
        return df

    def _augment(self, df: pd.DataFrame) -> pd.DataFrame:
        return df

    def _match(self, df: pd.DataFrame, frp_title: str) -> pd.DataFrame:
        return df

    def run_frp_analysis(self, csv_location: Path, frp_title: str, year: int) -> pd.DataFrame:
        df = self._load(csv_location)
        df = self._standardize(df)
        df = self._filter(df, year)
        df = self._augment(df)
        df = self._match(df, frp_title)
        return df
