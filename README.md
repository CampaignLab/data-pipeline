## Campaign Lab Data Pipeline

#### What?

* We want to be able to structure our dataset - see [Campaign Lab Data Inventory](https://docs.google.com/spreadsheets/d/1s5zWhdXi0-YBUMkK2Le3cfENBsfc29vOnFhnfn8N6dU).
* In order to do this, we first should define what the structure (schema) of the different data sources are.
* This will help us down the line to create modules that transform our raw data into our target data, for later export into a database, R package, or any other tools for utilising the data in a highly structured and annotated format.

### How can I contribute?

* We need to go through each of the datasources that we have defined in "Campaign Lab Data Inventory", create a *transformer* (in the transformers folder), and associated schema for each datasource.
* The transformer should be able to be run in a machine locally, downloading the data and transforming it into a CSV (later importing it into a local database).
* To contribute:

* 1. Open an Issue with the name of the issue formatted as *description-rowIdentifier*, where description and rowIdentifier are what is in the excel spreadsheet "Campaign Lab Data Inventory".
* 2. Write a small description of which dataset you are trying to transform and create a schema for.
* 3. Open a Pull Request (create a branch with an appropriate name) when you're finished

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


### Dockerized
I'm learning my way around data science and Python. So am working with Docker to improve reproducability and other good reasons.
For now, have mounted the entire repo into the image's workspace.

* docker-compose up
* Get a login URL  (localhost:8888?token=...) from the output
* docker exec -it jupyter-notebook /bin/bash
* python -c 'from london_election_results import get_data; print(get_data())'