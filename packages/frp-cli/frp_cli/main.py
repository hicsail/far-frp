from argparse import ArgumentParser, BooleanOptionalAction
from pathlib import Path
from frp import FRPScholarlyAnalysis, Matcher
import toml


def scholarly_analysis(input_csv: Path, config_path: Path, frp_title: str, frp_year: int, save_results: bool, save_output: Path) -> None:
    if not input_csv.exists():
        print('File {} does not exist'.format(input_csv))
        exit(1)

    if not config_path.exists():
        print('File {} does not exist'.format(config_path))
        exit(1)

    with open(config_path, 'r') as config_file:
        config = toml.load(config_file)

    # Make the matcher
    matcher = Matcher(config['scholarly']['matcher'])

    # Run the analysis
    analyzer = FRPScholarlyAnalysis(matcher)

    # Collect the results
    results = analyzer.run_frp_analysis(input_csv, frp_title, frp_year)

    # If the user wants the data saved, save it to the output location
    if save_results:
        results.to_csv(save_output)

    print(results['Part of FRP'])


def main():
    parser = ArgumentParser()

    # Sub parser for the different commands
    sub_parser = parser.add_subparsers(dest='command', required=True)

    # Command: scholarly
    scholarly_parser = sub_parser.add_parser('scholarly')
    scholarly_parser.add_argument('--input',
                                  required=True,
                                  help='Input CSV')
    scholarly_parser.add_argument('--config',
                                  required=True,
                                  help='Location of the FRP config file')
    scholarly_parser.add_argument('--frp-title',
                                  required=False,
                                  default='Leveraging AI to Examine Disparities and Bias in Health Care',
                                  help='Name of the FRP to run matching against')
    scholarly_parser.add_argument('--frp-year',
                                  required=False,
                                  default=2022,
                                  type=int,
                                  help='Year to start (inclusive) considering articles')
    scholarly_parser.add_argument('--save-output',
                                  required=False,
                                  default=False,
                                  action=BooleanOptionalAction,
                                  help='Flag if the results of the matching should be stored')
    scholarly_parser.add_argument('--output-csv',
                                  required=False,
                                  default='data/scholarly_matching_results.csv',
                                  help='Where to store the results of the matching')

    args = parser.parse_args()

    # Determine the correct command to run
    if args.command == 'scholarly':
        scholarly_analysis(Path(args.input), Path(args.config), args.frp_title, args.frp_year, args.save_output, Path(args.output_csv))
        return
    else:
        print('Command {} not recognized'.format(args.command))


if __name__ == '__main__':
    main()
