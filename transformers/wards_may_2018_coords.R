library(tidyverse)
library(sf)

# ---- sources ----

wards_zip <- here::here("transformers", "wards_may_2018_uk_bfc.zip")

# http://geoportal.statistics.gov.uk/datasets/fba403b550d3456b813714bfbe7d0f0c_0
"https://opendata.arcgis.com/datasets/fba403b550d3456b813714bfbe7d0f0c_0.zip" %>%
  download.file(wards_zip)

wards_dsn <- here::here("transformers", "wards_may_2018_uk_bfc")

unzip(wards_zip, exdir = wards_dsn)

# ---- centroid extraction ----

wards <- st_read(wards_dsn) %>%
  st_centroid()

lat_long <- wards %>%
  as_tibble() %>%
  extract(geometry, into = c("lat", "long"), "\\((.*),(.*)\\)",
          convert = TRUE) %>%
  select(wd18cd, wd18nm, lat, long)

# ---- save csv ----

write_csv(lat_long,
          here::here("schemas", "wards_may_2018_coords.csv"), na = "")

# ---- test plot ----

# ggplot() +
#   geom_sf(data = wards, size = 0.1, alpha = 0.4) +
#   coord_sf()
