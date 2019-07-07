#!python3

"""2011 census info lookup by ward - given the dataset, """
"""returns a function which looks up a row in that dataset, """
"""assuming that the column is headed 'WD11CD' """


def make_row_by_GSS (dataset):
    # TODO: Remove nulls
    def selection_fn(wd11cd):
        # TODO: Add some input checking here. (port isGSS() from js-xlsx branch)
        mask = (dataset['WD11CD'] == wd11cd)
        return dataset[mask]
    return selection_fn
