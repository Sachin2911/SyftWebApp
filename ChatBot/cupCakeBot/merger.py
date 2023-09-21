import requests
import pandas as pd
from urllib.parse import urlparse

# List of all the data sources
url_list = [
    "https://hackathon.syftanalytics.com/api/contacts",
    "https://hackathon.syftanalytics.com/api/invoice",
    "https://hackathon.syftanalytics.com/api/invoice-lines",
    "https://hackathon.syftanalytics.com/api/item",
]
headers = {'x-api-key': 'e6506999-8738-4866-a13f-2a2cfb14ba99'}

# Function to generate the output dictionary
def generate_output_dict(url_list):
    return {urlparse(url).path.split('/')[-1]: {"url": url, "data": None} for url in url_list}

# Function to fetch and store data in the output dictionary
def fetch_data(output_dict):
    for key, val in output_dict.items():
        response = requests.get(val['url'], headers=headers)
        if response.status_code == 200:
            val['data'] = response.json()["data"]
        else:
            print(f"Failed to get data for {key}: {response.content}")

# Function to create a DataFrame
def create_dataframe(data):
    return pd.DataFrame(data) if data else pd.DataFrame()

# Main code
output = generate_output_dict(url_list)
fetch_data(output)

contacts_df = create_dataframe(output["contacts"]["data"])
invoice_df = create_dataframe(output["invoice"]["data"])
invoice_info_df = create_dataframe(output["invoice-lines"]["data"])
items_df = create_dataframe(output["item"]["data"])

# Merging and cleaning data
invoice_df["invoice_id"] = invoice_df["id"]
invoice_merged = pd.merge(invoice_df, invoice_info_df, on='invoice_id', how='outer') \
                   .rename(columns={"id_x": "id_invoice", "id_y": "id_invoice_info", "total_x": "total"}) \
                   .drop("total_y", axis=1)

contacts_df["contact_id"] = contacts_df["id"]
contacts_merged = pd.merge(invoice_merged, contacts_df, on='contact_id', how='outer')

#Creating the revenue, expense and profit
contacts_merged["code"] = contacts_merged["item_code"]
merger = pd.merge(contacts_merged, items_df[['code', 'sale_unit_price']], on='code', how='left')
merger = pd.merge(merger, items_df[['code', 'purchase_unit_price']], on='code', how='left')
merger.fillna(0, inplace=True)

merger["revenue"] = merger["quantity"]*merger["sale_unit_price"]
merger["expense"] = merger["quantity"]*merger["purchase_unit_price"]
merger.drop("code", inplace=True, axis=1)

merger.loc[(merger['revenue'] == 0) & (merger['is_sale'] == True), 'revenue'] = merger['total']
merger.loc[(merger['expense'] == 0) & (merger['is_sale'] == False), 'revenue'] = merger['total']
merger["profit"] = merger["revenue"] - merger["expense"]


merger.to_csv("./data/merged.csv")
