#!/usr/bin/env python
# coding: utf-8

# # Setup

import pandas as pd

def normalise_data(text):
    text = text.lower()
    # Replace with space
    text = text.replace("-"," ")
    
    # Replace with no space
    text = text.replace("and","")
    text = text.replace("city of","")
    text = text.replace("&","")
    text = text.replace(".","")
    text = text.replace(",","")
    text = text.replace("'","")
    
    # Fix double spaces
    text = text.replace("  "," ")
    text = text.strip()
    return text



# # 2014 Results

election_14 = pd.read_csv("Election Results 2014.csv")


mask = election_14["Ward"].isnull() == False
election_14["Ward_2"] = election_14["Ward"][mask].map(lambda x: normalise_data(x))

mask = election_14["Council"].isnull() == False
election_14["Council_2"] = election_14["Council"][mask].map(lambda x: normalise_data(x))


ONS_18.to_csv('../schemas/Clean_output_Results_2014.csv')

