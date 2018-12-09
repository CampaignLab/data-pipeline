#!/usr/bin/env python3
import csv
import os
from time import sleep
from json_paginator import JsonApiPaginator


EE_BASE = "https://elections.democracyclub.org.uk/api/"


def write_csv(filename, csv_columns, dict_data):
    with open(filename, "w") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=csv_columns)
        writer.writeheader()
        for data in dict_data:
            writer.writerow(data)


def get_next_page(url, body):
    try:
        return body["next"]
    except KeyError:
        return None


def is_ballot(election):
    return election["group_type"] == None


def make_row(election):
    ballot_id = election["election_id"]
    _, gss_code = election["division"]["official_identifier"].split(":")
    return {"ballot_id": ballot_id, "gss_code": gss_code}


def make_rows(poll_open_date, election_type):
    rows = []

    pages = JsonApiPaginator(
        EE_BASE + "elections/?poll_open_date={}".format(poll_open_date), get_next_page
    )
    for url, page in pages:
        print("🔍 searching {} ...".format(url))
        ballots = [
            election
            for election in page["results"]
            if is_ballot(election)
            and election["election_type"]["election_type"] == election_type
        ]
        print("👀 found {} ballots".format(len(ballots)))
        for ballot in ballots:
            rows.append(make_row(ballot))
        sleep(2)  # have a little sleep so we don't hammer the API too much
    return rows


def make_ballot_to_gss_csv(poll_open_date, election_type, filename):
    rows = make_rows(poll_open_date, election_type)

    directory = os.path.abspath(os.path.join(os.path.dirname(__file__), "../schemas/"))
    if not os.path.exists(directory):
        os.makedirs(directory)

    write_csv(
        os.path.abspath(os.path.join(directory, filename)),
        ["ballot_id", "gss_code"],
        rows,
    )


if __name__ == "__main__":
    make_ballot_to_gss_csv("2018-05-03", "local", "id_to_gss_local.2018-05-03.csv")
