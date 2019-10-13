library(tidyverse)


#Pre 2010
ward.populations.2002to2011 <- NULL

#loop over each year
for(i in 2002:2011) {
  
  #read in sheet and reshape data
  year.df <- readxl::read_excel("data/small_area_population_estimates/SAPE9DT2-ward-syoa-unformatted-mid2002-to-mid2010.xlsx",
                                sheet=paste0("Mid-",i)) %>%
    gather(key=sex_age,value=population,-WD12CD,-WD12NM,-LAD12CD,-LAD12NM,-all_ages) %>%
    mutate(sex=str_sub(sex_age,1,1), 
           sex=case_when(sex=="m" ~ "male",
                         sex=="f" ~ "female"),
           age=str_sub(sex_age,2),
           age=case_when(age=="90plus" ~ "90",
                         TRUE ~ age),
           age=as.numeric(age),
           year=i,
           boundaries=2012) %>%
    select(WD12CD, WD12NM, LAD12CD, LAD12NM, year, boundaries, sex, age, population)
  
  #bind to full dataset
  ward.populations.2002to2011 <- bind_rows(ward.populations.2002to2011, year.df)
  
  rm(year.df)
}
rm(i)

#rename variables for consistency with later years/data
ward.populations.2002to2011 <- ward.populations.2002to2011 %>%
  select(WardCode=WD12CD, WardName=WD12NM,
         LocalAuthorityCode=LAD12CD, LocalAuthorityName=LAD12NM,
         year,boundaries,sex,age,population)

#2011 (census stats)
ward.populations.2011.females <- read.csv("data/small_area_population_estimates/DC1117EW_wards_females.csv",
                                          skip=8) %>%
  rename(WardName='X2011.census.merged.ward', WardCode=mnemonic) %>%
  mutate(WardCodeStart = str_sub(WardCode,1,2)) %>%
  filter(WardCodeStart %in% c("E3","W3")) %>% select(-WardCodeStart) %>%
  gather(key=Age, value=Population,-WardName, -WardCode) %>%
  mutate(Age = case_when(Age=="All.categories..Age" ~ "All",
                         Age=="Age.under.1" ~ "0",
                         Age=="Age.85.and.over" ~ "85",
                         TRUE ~ str_sub(Age, 5))) %>% 
  filter(Age != "All") %>% 
  mutate(Sex = "female", year=2011, boundaries=2011) %>%
  select(WardCode, WardName, year, boundaries, sex=Sex, age=Age, population=Population)

ward.populations.2011.males <- read.csv("data/small_area_population_estimates/DC1117EW_wards_males.csv",
                                        skip=8) %>%
  rename(WardName='X2011.census.merged.ward', WardCode=mnemonic) %>%
  mutate(WardCodeStart = str_sub(WardCode,1,2)) %>%
  filter(WardCodeStart %in% c("E3","W3")) %>% select(-WardCodeStart) %>%
  gather(key=Age, value=Population,-WardName, -WardCode) %>%
  mutate(Age = case_when(Age=="All.categories..Age" ~ "All",
                         Age=="Age.under.1" ~ "0",
                         Age=="Age.85.and.over" ~ "85",
                         TRUE ~ str_sub(Age, 5))) %>% 
  filter(Age != "All") %>% 
  mutate(Sex = "male", year=2011, boundaries=2011) %>%
  select(WardCode, WardName, year, boundaries, sex=Sex, age=Age, population=Population)

ward.populations.2011 <- bind_rows(ward.populations.2011.females,
                                   ward.populations.2011.males) %>%
  mutate(age=as.numeric(age)) 
rm(ward.populations.2011.females, ward.populations.2011.males)

#post 2011
SYOA_estimates_file_list <- data.frame(
  files=c("data/small_area_population_estimates/SAPE12DT1-Mid-2012 Ward 2012 SYOA.xlsx",
          "data/small_area_population_estimates/SAPE16DT8-mid-2013-ward-2013-syoa-estimates.xlsx",
          "data/small_area_population_estimates/sape17dt8mid2014ward2014syoaestimates_tcm77-425287.xlsx",
          "data/small_area_population_estimates/SAPE18DT8-mid-2015-ward-2015-syoa-estimates.xlsx",
          "data/small_area_population_estimates/SAPE19DT8-mid-2016-ward-2016-syoa-estimates-unformatted.xlsx",
          "data/small_area_population_estimates/SAPE20DT8-mid-2012-ward-2017-syoa-estimates-unformatted.xlsx",
          "data/small_area_population_estimates/SAPE20DT8-mid-2013-ward-2017-syoa-estimates-unformatted.xlsx",
          "data/small_area_population_estimates/SAPE20DT8-mid-2014-ward-2017-syoa-estimates-unformatted.xlsx",
          "data/small_area_population_estimates/SAPE20DT8-mid-2015-ward-2017-syoa-estimates-unformatted.xlsx",
          "data/small_area_population_estimates/SAPE20DT8-mid-2016-ward-2017-syoa-estimates-unformatted.xlsx",
          "data/small_area_population_estimates/SAPE20DT8-mid-2017-ward-2017-syoa-estimates-unformatted.xlsx"),
  year=c(2012,2013,2014,2015,2016,2012,2013,2014,2015,2016,2017),
  boundaries=c(2012,2013,2014,2015,2016,2017,2017,2017,2017,2017,2017),
  skip=c(3,3,3,3,4,4,4,4,4,4,4)
)

wards.populations.2012to2017 <- NULL
for (i in 1:length(SYOA_estimates_file_list$files)) {
  
  year <- SYOA_estimates_file_list$year[[i]]
  file <- SYOA_estimates_file_list$files[[i]]
  boundaries <- SYOA_estimates_file_list$boundaries[[i]]
  skip <- SYOA_estimates_file_list$skip[[i]]
  
  female.df <- readxl::read_excel(path=as.character(file),
                                  sheet=paste0("Mid-",year," Females"), skip=skip) %>%
    mutate(sex="female", year=year, boundaries=boundaries) %>%
    gather(key=age,value=population,-'Ward Code 1',-'Ward Name 1', -'Local Authority', -sex, -year, -boundaries)
  
  male.df <- readxl::read_excel(path=as.character(file),
                                sheet=paste0("Mid-",year," Males"), skip=skip) %>%
    mutate(sex="male", year=year, boundaries=boundaries) %>%
    gather(key=age,value=population,-'Ward Code 1',-'Ward Name 1', -'Local Authority', -sex, -year, -boundaries)
  
  wards.populations.2012to2017 <- bind_rows(wards.populations.2012to2017, female.df, male.df)
  
  rm(year, file, boundaries, skip, male.df, female.df)
  
}
rm(i)

wards.populations.2012to2017 <- wards.populations.2012to2017 %>%
  filter(age != "All Ages") %>%
  mutate(age = case_when(str_sub(age,1,1) %in% c("M","F") ~ str_sub(age,2),
                         TRUE ~ age),
         age = case_when(age %in% c("90plus","90+") ~ "90",
                         TRUE ~ age),
         age = as.numeric(age)) %>%
  select(WardCode='Ward Code 1', WardName='Ward Name 1',
         LocalAuthorityName = 'Local Authority',
         year, boundaries, sex, age, population)

wards.populations.all <- bind_rows(ward.populations.2002to2011,
                                   ward.populations.2011,
                                   wards.populations.2012to2017) %>%
  filter(!is.na(population), !is.na(WardCode)) %>%
  mutate(WardCode=as.factor(WardCode), WardName=as.factor(WardName),
         LocalAuthorityCode=as.factor(LocalAuthorityCode),
         LocalAuthorityName=as.factor(LocalAuthorityName),
         sex=as.factor(sex))

rm(ward.populations.2002to2011, ward.populations.2011, wards.populations.2012to2017)

