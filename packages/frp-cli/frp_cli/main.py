from argparse import ArgumentParser
from pathlib import Path
from frp import FRPScholarlyAnalysis, Matcher


def scholarly_analysis(input_csv: Path) -> None:
    if not input_csv.exists():
        print('File {} does not exist'.format(input_csv))
        exit(1)

    # Make the matcher
    matcher = Matcher()

    # Run the analysis
    analyzer = FRPScholarlyAnalysis(matcher)

    # Collect the results
    results = analyzer.run_frp_analysis(input_csv, 'Title', 2022)

    print(results['Part of FRP'])


def main():
    parser = ArgumentParser()

    # Sub parser for the different commands
    sub_parser = parser.add_subparsers(dest='command', required=True)

    # Command: scholarly
    scholarly_parser = sub_parser.add_parser('scholarly')
    scholarly_parser.add_argument('--input', required=True, help='Input CSV')

    args = parser.parse_args()

    # Determine the correct command to run
    if args.command == 'scholarly':
        scholarly_analysis(Path(args.input))
        return
    else:
        print('Command {} not recognized'.format(args.command))


if __name__ == '__main__':
    main()
