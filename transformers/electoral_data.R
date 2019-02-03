library(tidyverse)

# This file cleans all of the electoral data published by the electoral commission, including
# - electoral and voting details for all elections
# - results for some elections (mainly recent GEs)


#3 May 2018 Local, City Mayoral and Combined Authority Mayoral elections in England Electoral data (ODS)

CAM_May_2018_district_wards <- readODS::read_ods(path="data/ElectoralData/2018-May-local/Electoral-data-Local-Elections-May-2018.ods",
                                                 sheet="Districts_(Wards)",
                                                 skip=2) %>%
  rename(WD18CD='ONS Ward code',
         WD18NM='Ward',
         LAD18CD='Local Authority code',
         LAD18NM="Local Authority") %>%
  gather(key=var, value=val, -WD18CD, -WD18NM, -LAD18CD, -LAD18NM) %>%
  mutate(date="03-05-2018",
         geography_type="ward",
         geography_id_type="WD18CD",
         geography_id=WD18CD,
         election_type="local_district")

CAM_May_2018_unitary_wards <- readODS::read_ods(path="data/ElectoralData/2018-May-local/Electoral-data-Local-Elections-May-2018.ods",
                                                sheet="Unitary_(Wards)",
                                                skip=2) %>%
  rename(WD18CD='ONS Ward code',
         WD18NM='Ward',
         LAD18CD='Local Authority code',
         LAD18NM='Local Authority') %>%
  gather(key=var, value=val, -WD18CD, -WD18NM, -LAD18CD, -LAD18NM) %>%
  mutate(date="03-05-2018",
         geography_type="ward",
         geography_id_type="WD18CD",
         geography_id=WD18CD,
         election_type="local_unitary")


CAM_May_2018_met_wards <- readODS::read_ods(path="data/ElectoralData/2018-May-local/Electoral-data-Local-Elections-May-2018.ods",
                                                sheet="Met_(Wards)",
                                                skip=2) %>%
  rename(WD18CD='ONS Ward code',
         WD18NM='Ward',
         LAD18CD='Local Authority code',
         LAD18NM='Local Authority') %>%
  gather(key=var, value=val, -WD18CD, -WD18NM, -LAD18CD, -LAD18NM) %>%
  mutate(date="03-05-2018",
         geography_type="ward",
         geography_id_type="WD18CD",
         geography_id=WD18CD,
         election_type="local_met")

CAM_May_2018_london_wards <- readODS::read_ods(path="data/ElectoralData/2018-May-local/Electoral-data-Local-Elections-May-2018.ods",
                                            sheet="London_Boroughs_(Wards)",
                                            skip=2) %>%
  rename(WD18CD='ONS Ward code',
         WD18NM='Ward',
         LAD18CD='Local Authority code',
         LAD18NM='Local Authority') %>%
  gather(key=var, value=val, -WD18CD, -WD18NM, -LAD18CD, -LAD18NM) %>%
  mutate(date="03-05-2018",
         geography_type="ward",
         geography_id_type="WD18CD",
         geography_id=WD18CD,
         election_type="local_london")


CAM_May_2018_mayoral <- readODS::read_ods(path="data/ElectoralData/2018-May-local/Electoral-data-Local-Elections-May-2018.ods",
                                               sheet="Mayoral",
                                               skip=2) %>%
  rename(LAD18NM='Local Authority') %>%
  gather(key=var, value=val, -LAD18NM) %>%
  mutate(date="03-05-2018",
         geography_type="ward",
         geography_id_type="LAD18NM",
         geography_id=LAD18NM,
         election_type="local_london_mayoral") %>%
  filter(LAD18NM %in% c("Hackney","Lewisham","Newham","Tower Hamlets","Watford"))

#8 June 2017 UK Parliament general election 	Electoral data (CSV - Zip file)

UKPGE_June_2017 <- read.csv("data/ElectoralData/2017-June-UKPGE/2017 UKPGE electoral data 3.csv", skip=2) %>%
  gather(key=var, value=var, -'ONS.Code') %>%
  mutate(date="08-06-2017",
         geography_type="parliamentary_constituency",
         geography_id_type="PCON17CD",
         geography_id='ONS.Code',
         election_type="parliamentary_general_election") %>%
  filter(geography_id != "", !is.na(geography_id))

  #note results are in 2017 UKPGE electoral data 4.csv
  

#4 May 2017 Combined Authority Mayoral elections 	Electoral data (CSV - Zip file)




#4 May 2017 English local council elections
#4 May 2017 Welsh local council elections	Electoral data (CSV - Zip file)
#4 May 2017 Scottish local council elections Electoral data (XLS)	Electoral data (CSV - Zip file)
#23 June 2016 Referendum on the UK's membership of the EU Electoral data (XLS) 	Electoral data (CSV - Zip file)
#5 May 2016 English Local council elections Electoral data (CSV - Zip file)
#5 May 2016 London Mayoral election & Greater London Authority election Electoral data (CSV - Zip file)
#5 May 2016 National Assembly for Wales election Electoral data and Results (CSV - Zip file)
#5 May 2016 Police and Crime Commissioner (PCC) elections Electoral data (CSV - Zip file)
#5 May 2016 Scottish Parliament election Electoral data and Results (CSV - Zip file)
#7 May 2015 UK Parliament general election Electoral data (CSV - Zip file) Results (CSV - Zip file)
#7 May 2015 	English Local council elections Electoral data (CSV files - ZIP)
#18 September 2014 Scottish Independence Referendum Electoral data (CSV)
#22 May 2014 	European Parliament election Electoral data (CSV files - ZIP)
#15 November 2012 	Police and Crime Commissioner (PCC) elections Electoral data (XLS)
#3 May 2012 	Welsh local council elections 	Report (PDF) 	Electoral data (XLS)
#3 May 2012 	Scottish local council elections 	Report (PDF) 	Electoral data (XLS)
#3 May 2012 	London mayoral election 	Report (PDF) 	Electoral data (XLS)
#5 May 2011 	National Assembly for Wales election 	Report (PDF) 	Electoral data (XLS) Results (XLS)
#5 May 2011 	Scottish Parliament election 	Report (PDF) 	Electoral data (XLS) Results (XLS)
#4 June 2009 	European Parliament election 	Report (PDF) 	Electoral data (XLS)

electoral_data <- bind_rows(CAM_May_2018_district_wards,CAM_May_2018_unitary_wards, CAM_May_2018_met_wards, 
                            CAM_May_2018_london_wards, CAM_May_2018_mayoral,
                            UKPGE_June_2017) %>%
  filter(!is.na(geography_id),!is.na(date)) %>%
  select(date,geography_type,geography_id_type,geography_id,election_type,var,val) %>%
  mutate(var = case_when(
    var %in% c("Number of seats") ~ "number_seats",
    var %in% c("Electorate") ~ "electorate",
    var %in% c("Total valid votes cast") ~ "valid_votes"
  )) %>% 
  filter(var %in% c("number_seats","electorate","valid_votes"))

rm(CAM_May_2018_district_wards,CAM_May_2018_unitary_wards, CAM_May_2018_met_wards, 
   CAM_May_2018_london_wards, CAM_May_2018_mayoral,
   UKPGE_June_2017)


#Summaries

electoral_data %>% group_by(date, geography_type, election_type) %>%
  summarise(elections=n_distinct(geography_id), rows=n()) %>% 
  mutate(rows_per_election = rows/elections) %>% ungroup()