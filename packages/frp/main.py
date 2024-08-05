from argparse import ArgumentParser
from pathlib import Path
from frp import FRPScholarlyAnalysis, Matcher, GrantAnalysis
import toml
import requests
import pandas as pd
import json


def download_csv(csv_url: str, download_location: Path) -> None:
    """
    Handles downloading the CSV from the given
    URL.
    """
    result = requests.get(csv_url)

    with open(download_location, 'wb') as csv_file:
        csv_file.write(result.content)


def run_analysis(csv_location: Path, config_path: Path, frp_title: str, frp_year: int, matching_type: str) -> pd.DataFrame:
    """
    Handles passing the running the analysis process.
    """
    # Read in the config
    if not config_path.exists():
        print(f'File {config_path} does not exist')
    with open(config_path, 'r') as config_file:
        config = toml.load(config_file)

    # Configure the matcher
    matcher = Matcher(config[matching_type]['matcher'])

    # Configure the analyzer
    if matching_type == 'scholarly':
        analyzer = FRPScholarlyAnalysis(matcher, config[matching_type])
    else:
        analyzer = GrantAnalysis(matcher, config[matching_type])

    # Collect the results
    return analyzer.run_frp_analysis(csv_location, frp_title, frp_year)


def return_results(results: pd.DataFrame, webhook_url: str, webhook_payload: dict, matching_type) -> None:
    """
    Return the results back to the specified location
    """
    if matching_type == 'scholarly':
        columns_of_interest = {
            'Title OR Chapter title': 'title',
            'Canonical journal title': 'journal',
            'Authors OR Patent owners OR Presenters': 'authors',
            'Reporting date 1': 'publicationDate'
        }
    else:
        columns_of_interest = {
            'Award Title OR Proposal Title': 'title',
            'Total Anticipated Amount OR Total Requested Amount amount': 'amount'
        }

    # Get only the matches
    results = results[results['Part of FRP']]

    # Get the columns needed for the analysis results
    results = results[columns_of_interest.keys()]

    # Rename the columns to match the expected format for the completion webhook
    results = results.rename(columns=columns_of_interest)

    # Convert the timestamp fields
    if matching_type == 'scholarly':
        results['publicationDate'] = results['publicationDate'].dt.strftime('%d-%m-%Y')
    results.fillna('', inplace=True)

    # Convert the data to a dictionary
    payload = dict()
    payload['results'] = results.to_dict('records')

    # Combine the data with the other webhook payload
    payload.update(webhook_payload)

    result = requests.post(webhook_url, json=payload)

    if result.status_code != 201:
        print(f'Request failed with code {result.status_code}: {result.content}')
        raise Exception('Failed to share results')


def main():
    parser = ArgumentParser()
    parser.add_argument('csv_url',
                        help='URL of the CSV for publications to download')
    parser.add_argument('frp_title',
                        help='FRP title for matching against')
    parser.add_argument('frp_year',
                        help='Year the FRP should be matched against')
    parser.add_argument('webhook_url',
                        help='The webhook to call when the matching has completed')
    parser.add_argument('webhook_payload',
                        help='JSON of the data that needs to be passed to the webhook')
    parser.add_argument('--csv_location',
                        required=False,
                        default='/tmp/publications.csv',
                        help='Location to download the CSV to')
    parser.add_argument('--config_location',
                        required=False,
                        default='./config.toml',
                        help='Location of the config for running the analysis')
    parser.add_argument('--type',
                        required=False,
                        default='scholarly',
                        choices=['scholarly', 'grant'])

    args = parser.parse_args()

    # Download the CSV to a local location
    download_csv(args.csv_url, args.csv_location)

    # Run the matching logic
    results = run_analysis(Path(args.csv_location),
                           Path(args.config_location),
                           args.frp_title,
                           int(args.frp_year),
                           args.type)

    # Pass the results back to the webhook
    return_results(results, args.webhook_url, json.loads(args.webhook_payload), args.type)


if __name__ == '__main__':
    main()
