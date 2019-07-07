#!python3

"""education level lookup by ward - given the GSS (with old style 95xxxxx codes for NI), """
"""row_by_GSS(GSScode) returns a full row """

import pandas as pd
import argparse
import by_ward_lookup as maker

# # Download .csv from here using nomis. It's not uploaded to github.
# SPREADSHEET_URL = ("https://www.nomisweb.co.uk/census/2011/ks501ew")
# SCHEMA_URL = ("https://www.nomisweb.co.uk/census/2011/ks501uk.pdf")


def main():
    parser = argparse.ArgumentParser(description='Output a row')
    parser.add_argument('--datafile', metavar='csv_file', type=str,
                        default="../data/education_level.csv",
                        help='CSV data file for querying')
    parser.add_argument('codes', metavar='GSScodes', type=str,
                        nargs='*',
                        help='WD11CD ward code/s (may be 95xxxxx for N.I.), e.g. E36000091 95ZZ16')

    args = parser.parse_args()

    edlevel = pd.read_csv(args.datafile)

    ### This grabs the row
    """row_by_GSS(GSScode) is a function that returns a full row as pandas DataFrame """
    row_by_GSS = maker.make_row_by_GSS(edlevel)

    for code in args.codes:
        print (code+':')

        row = row_by_GSS(code)

        print(row)
        print()


if __name__ == "__main__":
    main()
