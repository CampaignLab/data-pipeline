library(tidyverse)

# destination for Democracy Club's results csv
dest <- here::here("transformers", "democracyclub-results-2018-05-03.csv")

download.file(
  "https://candidates.democracyclub.org.uk/media/csv-archives/results-2018-05-03.csv",
  dest)

# load csv
source <- read_csv(dest, skip = 1) %>% mutate_at("is_winner", as.logical)

# one-to-many replications across rows, so make some helper tables
spoilt_ballots <- source %>%
  group_by(ballot_paper_id) %>%
  slice(which.max(spoilt_ballots)) %>%
  select(ballot_paper_id, spoilt_ballots) %>%
  ungroup() %>%
  rename(ballots_cast = spoilt_ballots) %>%
  mutate(party_name = "Spoilt")

total_ballots <- source %>%
  group_by(ballot_paper_id) %>%
  summarise(total_ballots = sum(ballots_cast)) %>%
  left_join(spoilt_ballots) %>%
  rowwise() %>%
  mutate(total_ballots = sum(total_ballots, spoilt_ballots, na.rm = TRUE)) %>%
  select(-spoilt_ballots)

# turnout format sometimes percentages sometimes total number sometimes missing
turnout <- source %>%
  group_by(ballot_paper_id) %>%
  slice(which.max(turnout)) %>%
  select(ballot_paper_id, turnout) %>%
  mutate(turnout_percent = ifelse(turnout <= 100, turnout, NA),
         turnout_number = ifelse(turnout > 100, turnout, NA)) %>%
  ungroup()

# combine these back into a results table
# no turnout
results <- source %>%
  bind_rows(spoilt_ballots) %>%
  left_join(total_ballots, by = "ballot_paper_id") %>%
  mutate(ballots_share = ballots_cast / total_ballots) %>%
  group_by(ballot_paper_id, party_name) %>%
  summarise(party_ballots_share = sum(ballots_share)) %>%
  ungroup()

# test all elections ballots share sum to 1
results %>%
  group_by(ballot_paper_id) %>%
  summarise(sum_share = sum(party_ballots_share)) %>%
  arrange(desc(sum_share))

results %>%
  write_csv(here::here("schemas", "local_election_results_2018-05-03.csv"),
            na = "")
