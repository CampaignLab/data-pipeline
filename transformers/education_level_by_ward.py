#!python3

"""education level lookup by ward - given the GSS (with old style 95xxxxx codes for NI), """
"""row_by_GSS(GSScode) returns a full row """

import pandas as pd
import argparse
import by_ward_lookup as maker


def main():
    parser = argparse.ArgumentParser(description='Output a row')
    parser.add_argument('codes', metavar='GSScodes', type=str,
                        nargs='*', default=['E36000091','95ZZ16'],
                        help='WD11CD ward code/s (may be 95xxxxx for N.I.)')

    args = parser.parse_args()
    for code in args.codes:
        print (code+':')
        print (row_by_GSS(code))


edlevel = pd.read_csv('./education_level.csv')

### This grabs the row
"""row_by_GSS(GSScode) is a function that returns a full row as pandas DataFrame """
row_by_GSS = maker.make_row_by_GSS(edlevel)

main()
