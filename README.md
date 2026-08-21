## Campaign Lab Data Pipeline

For context, see [Campaign Lab Guide](https://github.com/CampaignLab/Campaign-Lab-Guide/blob/master/Campaign%20Lab%20Guide.md0).

#### What?

* We want to be able to structure our dataset from the Data Inventory.
* In order to do this, we first should define what the structure (schema) of the different data sources are.
* This will help us down the line to create modules that transform our raw data into our target data, for later export into a database, R package, or any other tools for utilising the data in a highly structured and annotated format.

### How can I contribute?

* We need to go through each of the datasources that we have defined in "Campaign Lab Data Inventory", create a *transformer* (in the transformers folder), and associated schema for each datasource.
* The transformer should be able to be run in a machine locally, downloading the data and transforming it into a CSV (later importing it into a local database).
* To contribute:

    1. Open an Issue with the name of the issue formatted as *description-rowIdentifier*, where description and rowIdentifier are what is in the excel spreadsheet "Campaign Lab Data Inventory".
    2. Write a small description of which dataset you are trying to transform and create a schema for.
    3. Open a Pull Request (create a branch with an appropriate name) when you're finished

### Formatting

* We need to make sure we format similar fields between datasources in the same way.

* For now, the standardization should follow:

* Timestamp fields: 2015-06-30T22:30:00.000Z

### What is a schema?

* A schema in this case is basically just a JSON (JavaScript Object Notation) that *describes* the *structure* and *format* of the dataset.

* an example schema would be

```{
  "title": "Election results",
  "source": "https://data.police.uk/docs/method/forces/"
  "description": "A dataset of election results",
  "properties": {
    "county": {
      "type": ["string"],
      "description": "The county in which the result was"
    },
    "number_of_votes": {
      "type": ["integer"],
      "description": "The number of votes that were received"
    },
    "party": {
      "type": ["string"],
      "description": "the party which was receiving votes"
    }
  }
}
```

* The *title* tells you the name of the dataset (you can make this up)
* *source* is a link (if available) to the actual dataset.
* The *description* is a one liner that describes the dataset
* *properties* is a list of the *datapoints* that we want to *end up with after transforming the raw dataset*.


### Toolset
(Author is learning his way around data science and Python, better approaches welcome.)
Datasets are expected to be largely static; transformers are intended to be manually run and eyeballed as needed, instead of automated.
They can be run in a local environment.
For reproducability and dev tooling, can also use a container environment via Docker.

Run a specific command:
`docker-compose run datascience python -c 'from london_election_results import get_data; print(get_data())'`

Running the environment:

* `docker-compose up`
* `http://localhost:9200` #elasticsearch
* `http://localhost:5601` #kibana
* Can import a CSV with e.g.
* `docker-compose run datascience python -c 'elasticsearch_loader --es-host http://elasticsearch:9200 --index campaignlab --type campaignlab csv ../schemas/local_election_results_2018-05-03.csv`
* Follow https://www.elastic.co/guide/en/kibana/current/tutorial-build-dashboard.html to visualise.