#!python3

"""education level lookup by ward - given the GSS (with old style 95xxxxx codes for NI), """
"""row_by_GSS(GSScode) returns a full row """

import pandas as pd
import by_ward_lookup as maker


def main():
    print (row_by_GSS('E36000091'))
    print (row_by_GSS('95ZZ16'))


edlevel = pd.read_csv('./education_level.csv')

"""row_by_GSS(GSScode) is a function that returns a full row as pandas DataFrame """
row_by_GSS = maker.make_row_by_GSS(edlevel)

main()
