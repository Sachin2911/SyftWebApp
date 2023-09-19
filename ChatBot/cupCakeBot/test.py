import re

teststring = "Query: Give me all the rental transactions Prompt: Give analysis on this"
tester = re.split('Query:|,|Prompt:', teststring)
fnl = [item for item in tester if item != '']
print(fnl)