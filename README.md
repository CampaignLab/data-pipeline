## Campaign Lab Data Pipeline

#### What?

* We want to be able to structure our dataset (see "Campaign Lab Data Inventory").
* In order to do this, we first should define what the structure (schema) of the different data sources are.
* This will help us down the line to create modules that transform our raw data into our target data, for later export into a database, R package, or any other tools for utilising the data in a highly structured and annotated format.


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
