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
            'Publication date OR Date awarded OR Presentation date': 'datetime64',
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

    def run_frp_analysis(self, csv_location: Path, frp_title: str, year: int) -> pd.DataFrame:
        df = self._load(csv_location)
        df = self._standardize(df)
        df = self._filter(df, year)
        df = self._augment(df)
        df = self._match(df)
        return df
