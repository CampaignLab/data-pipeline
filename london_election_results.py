import pandas as pd


SPREADSHEET_URL = ("https://docs.google.com/spreadsheets/d/" +
                   "14GKPoj-E1CN0ZmiUd5gQWUi5zvGWbDoNoGT82RqKEno/" +
                   "export?&format=csv")

PARTY_NAMES = ["Con", "Lab", "LDem", "UKIP", "Grn", "Ind", "Oth"]
PARTY_COLUMNS = ["seats", "seats_previous", "votes", "percent", "percent_pm",
                 "votes_previous", "percent_previous"]
NON_PARTY_COLUMNS = ["Authority", "Ward", "No. up for election:"]
NAME_MAP = {
    "Authority": "authority",
    "Ward": "ward",
    "No. up for election:": "contested_seats"
}


def get_data():
    """Returns a dataframe matching schemas/london_election_results.json"""
    wards = pd.read_csv(SPREADSHEET_URL, skiprows=2, header=0,
                        na_values=['#VALUE!', '#DIV/0!'])
    to_drop = [col for col in wards.columns if 'Unnamed' in col] + ["Constituency"]
    wards = wards.drop(to_drop, axis=1)
    wards = wards.set_index(NON_PARTY_COLUMNS)
    party_column_tuples = [(c, n) for c in PARTY_COLUMNS for n in PARTY_NAMES]
    wards.columns = pd.MultiIndex.from_tuples(party_column_tuples)

    return (wards
            .stack()
            .fillna(0)
            .reset_index()
            .rename(columns={**{"level_3": 'party'}, **NAME_MAP}))
