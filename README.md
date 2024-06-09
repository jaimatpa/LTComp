# LeetComp

Analysing compensations mentioned on the Leetcode forums.

LeetComp works by regularly fetching new posts from the [leetcode compensations page](https://leetcode.com/discuss/compensation). The `leetcomp` directory contains python scripts to fetch and parse new posts. New posts are updated in `posts.db`, a SQLite database. The parsed posts are updated directly into `js/data.js` which helps power the content in `index.html`.

IMO, this tool can be best used to figure out the "software developer salaries in india" across various experience levels.

---

## Setup

```bash
# Install poetry following the instructions at https://python-poetry.org/docs or use pip
$ pip install poetry

# Setup the project (from the project root directory)
$ poetry install

# To run the commands for updating the data, go into the venv created by poetry
$ poetry shell

# Tested on python 3.9.7
```

## Updating data

```bash
$ poetry shell
$ export PYTHONPATH=.
$ python update.py

-----------Fetching posts meta info-----------
Found 6835 posts(456 pages)
73 posts synced, skipping the rest ...
---------Updating posts with content----------
Found 73 post ids without content, syncing ...
PostID 1786560;   0/73 posts done
PostID 1783572;  10/73 posts done
PostID 1781876;  20/73 posts done
PostID 1780132;  30/73 posts done
PostID 1779056;  40/73 posts done
PostID 1777850;  50/73 posts done
PostID 1776532;  60/73 posts done
PostID 1775146;  70/73 posts done
All posts synced
----------------Parsing posts----------------
Total posts: 6905
N posts dropped (missing data): 1448
Posts with all the info: 5468
Posts with Location: 5150
Posts with YOE: 5385
Posts from India: 3923
Posts with Total Comp: 2257
Dropped 181/3923 records due to invalid pay
-----------Building inverted index------------
Keeping 1303/1303 tokens
```
