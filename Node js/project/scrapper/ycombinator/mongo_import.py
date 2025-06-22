import json
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "ycombinator"
COLLECTION_NAME = "companies"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

with open('results/companies.json', 'r', encoding='utf-8') as f:
    companies = json.load(f)

# Insert or update companies by name (upsert)
for company in companies:
    collection.update_one(
        {"name": company["name"]},
        {"$set": company},
        upsert=True
    )

print(f"Inserted/updated {len(companies)} companies into MongoDB.")
