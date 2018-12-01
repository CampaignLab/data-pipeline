
#!/usr/bin/env python
# coding: utf-8

# # Setup

import pandas as pd

def get_dc_results(results_csv) -> pd.DataFrame:
    results = pd.read_csv(results_csv, header=1)
    
    BALLOT_PAPER_ID_COLS = ['election_type', 'local_authority', 'ward', 'date', '???']

    # lots of info is squashed into the `ballot_paper_id` column
    ballot_paper_id_list = results['ballot_paper_id'].str.split('.').tolist()
    ballot_paper_id_df = pd.DataFrame.from_records(ballot_paper_id_list)
    ballot_paper_id_df.columns = BALLOT_PAPER_ID_COLS
    ballot_paper_id_df['local_authority'] = (ballot_paper_id_df['local_authority']
                                             .str.replace('-', ' '))
    ballot_paper_id_df['ward'] = ballot_paper_id_df['ward'].str.replace('-', ' ')

    results = (results
               .join(ballot_paper_id_df)
               .loc[lambda df: df['election_type'] == 'local'])

    return results

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



# # 2018 Results

URL_2018_results = "https://candidates.democracyclub.org.uk/media/csv-archives/results-2018-05-03.csv"

results_2018 = get_dc_results(URL_2018_results)
results_2018.head()


results_2018_clean = results_2018
results_2018_clean['Council_2'] = results_2018_required['local_authority'].map(lambda x: normalise_data(x))
results_2018_clean['Ward_2'] = results_2018_required['ward'].map(lambda x: normalise_data(x))


# # 2018 ONS

ONS_18 = pd.read_csv("Output_Area_to_Ward_to_Local_Authority_District_May_2018_Lookup_in_England_and_Wales.csv")

mask = ONS_18["WD18NM"].isnull() == False
ONS_18["Ward_2"] = ONS_18["WD18NM"][mask].map(lambda x: normalise_data(x))

mask = ONS_18["LAD18NM"].isnull() == False
ONS_18["Council_2"] = ONS_18["LAD18NM"][mask].map(lambda x: normalise_data(x))


ONS_18.to_csv('../schemas/Clean_output_ONS_2018.csv')




# # 2018 ONS to Results

# ## Lookup File for 2018

# ### Ward+LA to Election results

ONS_18_short = ONS_18[['WD18CD','WD18NM','LAD18CD','LAD18NM','Ward_2','Council_2']]
ONS_18_short = ONS_18_short.drop_duplicates()


combined_2018 = pd.merge(results_2018_clean, ONS_18_short, how='left', left_on = ['Council_2','Ward_2'], right_on = ['Council_2','Ward_2'])

combined_2018.to_csv('../schemas/Clean_output_Results_2018.csv')


# ### Ward+LA Lookup file

results_2018_clean_short = results_2018_clean[['election_id','ballot_paper_id','Council_2','Ward_2']]
results_2018_clean_short = results_2018_clean_short.drop_duplicates()

combined_2018 = pd.merge(ONS_18_short,results_2018_clean_short, how='left', left_on = ['Council_2','Ward_2'], right_on = ['Council_2','Ward_2'])

combined_2018 = combined_2018.rename(columns = {'Ward_2' : 'Ward_lookup'})
combined_2018 = combined_2018.rename(columns = {'Council_2' : 'Council_lookup'})

combined_2018['year'] = '2018'

combined_2018.to_csv('../schemas/Clean_output_Look_Up_File_Ward_Level.csv')
