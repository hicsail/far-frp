from pathlib import Path
import pandas as pd


class FRPScholarlyAnalysis:
    """
    Handles the cleaning and matching of MyCV CSVs to FRPs
    """
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
        return df

    def _filter(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Filter the dataframe for only the rows that match the
        requirements. This includes removing duplicates or
        """
        return df

    def _augment(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Add additional information to the dataframe which
        will allow for improved matching
        """
        return df

    def _match(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Handles running the FRP title matching against the rows
        of the dataframe
        """
        return df

    def run_frp_analysis(self, csv_location: Path, frp_title: str) -> pd.DataFrame:
        df = self._load(csv_location)
        df = self._standardize(df)
        df = self._filter(df)
        df = self._augment(df)
        df = self._match(df)
        return df
