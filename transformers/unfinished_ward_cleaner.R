# local election results 2018

library(readr)
library(stringr)
library(dplyr)

# 1. get the wards as recorded in the dataset
results2018 <- read_csv("./electionresults/local_election_results_2018-05-03.csv")

wards2018 <- results2018$ballot_paper_id
bigList <- str_split_fixed(wards2018, "\\.", 4) %>%
  as.data.frame()
names(bigList) <- c("election_type", "local_authority", "ward_name", "date")

wards2018 <- bigList %>%
  filter(election_type == "local") %>%
  select(local_authority, ward_name)

rm(bigList, results2018)

# 2. make one list of ward-LA lookups
nmd <- read_csv("./data/raw_data/Ward_Lookups_2018/CTRY_GOR_CTY_NMD_WD.csv")
md <- read_csv("./data/raw_data/Ward_Lookups_2018/CTRY_GOR_MD_WD.csv")
lb <- read_csv("./data/raw_data/Ward_Lookups_2018/CTRY_GOR_LB_WD.csv")
ua <- read_csv("./data/raw_data/Ward_Lookups_2018/CTRY_GOR_UA_WD.csv")

nmd <- nmd %>%
  mutate(LACD = NMDCD,
         LANM = NMDNM) %>%
  select(LACD, LANM, WDCD, WDNM)

md <- md %>%
  mutate(LACD = MDCD,
         LANM = MDNM) %>%
  select(LACD, LANM, WDCD, WDNM)

lb <- lb %>%
  mutate(LACD = LBCD,
         LANM = LBNM) %>%
  select(LACD, LANM, WDCD, WDNM)

ua <- ua %>%
  mutate(LACD = UACD,
         LANM = UANM) %>%
  select(LACD, LANM, WDCD, WDNM)

laWard2018 <- bind_rows(nmd, md, lb, ua)

rm(lb, md, nmd, ua)

# write_csv(laWard2018, "./data/raw_data/Ward_Lookups_2018/all_wards_2018.csv")

# laWard2018 contains the ONS codes
# wards2018 contains the labels used in the election results dataset

# 3. clean up the names
wards2018 <- wards2018 %>%
  mutate_all(as.character) %>%
  distinct()
laWard2018 <- laWard2018 %>%
  mutate_all(as.character) %>%
  distinct()

wards2018clean <- wards2018 %>%
  mutate_all(str_to_lower) %>%
  mutate_all(funs(str_replace_all(., "-", " "))) %>%
  mutate_all(funs(str_replace_all(., "\\band\\b", "")))
# fix double spaces

laWard2018clean <- laWard2018

laWard2018clean$LANM <- str_to_lower(laWard2018clean$LANM)
laWard2018clean$WDNM <- str_to_lower(laWard2018clean$WDNM)

write_csv(laWard2018clean, "tempONSwards.csv")
write_csv(wards2018clean, "tempELECTIONwards.csv")

laWard2018clean <- laWard2018clean %>%
  mutate_all(funs(str_replace_all(., "'", ""))) %>%
  mutate_all(funs(str_replace_all(., ",", ""))) %>%
  mutate_all(funs(str_replace_all(., "-", " "))) %>%
  mutate_all(funs(str_replace_all(., "&", ""))) %>%
  mutate_all(funs(str_replace_all(., "\\band\\b", "")))
# fix double spaces

anti_join(wards2018clean, laWard2018clean, by = c("local_authority" = "LANM", "ward_name" = "WDNM"))
