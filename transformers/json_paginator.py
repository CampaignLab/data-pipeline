import requests

# This is a local copy of the json-paginator because the pypi has a fatal bug in it
# The pypi version raises StopIteration at the end of __iter__(), which is a generator function,
# but that is illegal and causes the Python runtime system to raise it's own exception.
#
# https://pypi.org/project/json-paginator/
#

class JsonApiPaginator:

    def __init__(self, page1, get_next_page):
        self.next_page = page1
        self.get_next_page = get_next_page

    def __iter__(self):
        while self.next_page:
            r = requests.get(self.next_page)
            r.raise_for_status()
            body = r.json()
            this_page = self.next_page
            self.next_page = self.get_next_page(this_page, body)

            yield (this_page, body)
