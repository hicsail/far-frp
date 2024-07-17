from argparse import ArgumentParser
from pathlib import Path
import urllib.request
from frp import FRPScholarlyAnalysis, Matcher
import toml
import requests

def download_csv(csv_url: str, download_location: Path):
    """
    Handles downloading the CSV from the given
    URL.
    """
    result = requests.get(csv_url)

    with open(download_location, 'wb') as csv_file:
        csv_file.write(result.content)


def run_analysis(csv_location: Path, config_path: Path, frp_title: str, frp_year: int):
    """
    Handles passing the running the analysis process.
    """
    # Read in the config
    if not config_path.exists():
        print(f'File {config_path} does not exist')
    with open(config_path, 'r') as config_file:
        config = toml.load(config_file)

    # Configure the matcher
    matcher = Matcher(config['scholarly']['matcher'])

    # Configure the analyzer
    analyzer = FRPScholarlyAnalysis(matcher, config['scholarly'])

    # Collect the results
    return analyzer.run_frp_analysis(csv_location, frp_title, frp_year)


def main():
    parser = ArgumentParser()
    parser.add_argument('csv_url',
                        help='URL of the CSV for publications to download')
    parser.add_argument('frp_title',
                        help='FRP title for matching against')
    parser.add_argument('frp_year',
                        help='Year the FRP should be matched against')
    parser.add_argument('--csv_location',
                        required=False,
                        default='./data/publications.csv',
                        help='Location to download the CSV to')
    parser.add_argument('--config_location',
                        required=False,
                        default='./data/config.toml',
                        help='Location of the config for running the analysis')

    args = parser.parse_args()

    # Download the CSV to a local location
    download_csv(args.csv_url, args.csv_location)

    # Run the matching logic
    results = run_analysis(Path(args.csv_location),
                           Path(args.config_location),
                           args.frp_title,
                           args.frp_year)
    print(results)

if __name__ == '__main__':
    main()
