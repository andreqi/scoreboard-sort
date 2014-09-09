from contest import *
from contestant import *
import json
import sys
from xml.dom import minidom
from dateutil.parser import parse
from operator import attrgetter

def getLines(path):
    f = open(path, 'rb');
    ans = [line[:-1] for line in f.readlines()];
    f.close();
    return ans;

timer = int(sys.argv[2])
base = sys.argv[1]
contestPath = base + '/submitions.html'
xmldoc = minidom.parse(contestPath)
submitions = xmldoc.getElementsByTagName('tr')
problems = getLines(base+ '/problems.in')
contestants = getLines(base + '/contestants.in')
print contestants
outPath = base + '/scoreboard.json'
begin = parse(getLines(base+'/begin.in')[0])

def parseRow(row, tag):
    data = []
    for td in row.getElementsByTagName(tag): 
        for node in td.childNodes:
            if node.nodeType == node.TEXT_NODE:
                data.append(node.data)
            else:
                data.append(node.firstChild.data)
    return data

def splitEach(time_stream, seconds, get):
    end, start = seconds, 0
    ans, cur = [], []
    for idx, time in enumerate(time_stream): 
        if get(time) > end:
            ans.append(cur)
            cur = [time]
            end += seconds
        else: 
            cur.append(time)
    if cur:
        ans.append(cur)
    return ans

def toSubmition(row, begin):
    return Submition(
        handle = row[3],
        problem = row[4],
        seconds = (parse(row[-1]) - begin).total_seconds(),
        veredict = Veredict.getVeredict(row[6]),
    )

data = [parseRow(row, 'td') for row in submitions[1:]]
submitions = sorted([toSubmition(row, begin) for row in data], key=attrgetter('seconds'))

buckets = splitEach(submitions, timer, lambda x: x.seconds)

contest = Contest(contestants, problems)
ans = []
for bucket in buckets:
    for sub in bucket:
        contest.apply(sub)
    order = sorted(contest.getScoreboard(), key=lambda x: (-x.solved, x.penalty))
    ans.append(order)

print len(ans)

f = open(outPath, 'w+')
json_data = {
    'contestants': contestants,
    'contests': [str(((idx + 1) * (timer/60)))+"'" for idx in  range(len(ans))],
    'scoreboards': [[d.__dict__ for d in score] for score in ans],
}
json.dump(json_data, f)
f.close()

for contestant in sorted(contest.getScoreboard(), key=lambda x: (-x.solved, x.penalty)):
    print contestant
