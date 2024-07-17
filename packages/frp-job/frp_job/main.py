from argparse import ArgumentParser
from pathlib import Path
import urllib.request
from frp import FRPScholarlyAnalysis, Matcher


def download_csv(csv_url: str, download_location: Path):
    """
    Handles downloading the CSV from the given
    URL.
    """
    urllib.request.urlretrieve(csv_url, download_location)


def run_analysis(csv_location: Path, config_path: Path):
    """
    Handles passing the running the analysis process.
    """


def main():
    parser = ArgumentParser()
    parser.add_argument('csv_url',
                        required=True,
                        help='URL of the CSV for publications to download')
    parser.add_argument('frp_title',
                        required=True,
                        help='FRP title for matching against')
    parser.add_argument('frp_year',
                        required=True,
                        help='Year the FRP should be matched against')
    parser.add_argument('--csv_location',
                        required=False,
                        default='./publications.csv',
                        help='Location to download the CSV to')
    parser.add_argument('--config_location',
                        required=False,
                        default='./config.toml',
                        help='Location of the config for running the analysis')

    args = parser.parse_args()

    # Download the CSV to a local location
    download_csv(args.csv_url, args.download_location)

    # Run the matching logic

if __name__ == '__main__':
    main()
