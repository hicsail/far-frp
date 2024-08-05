from abc import ABC, abstractmethod
from frp.matcher import Matcher
from pathlib import Path
import pandas as pd


class Analysis(ABC):
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

    @abstractmethod
    def _standardize(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    def _filter(self, df: pd.DataFrame, year: int) -> pd.DataFrame:
        """
        Default filtering which handles considering just the year
        """
        df = df[df['Reporting date 1'].dt.year >= year]
        return df

    @abstractmethod
    def _augment(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

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
