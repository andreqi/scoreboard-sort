from contestant import *

class ContestantScore(object):
    
    def __init__(self, contestant):
        self.handle = ''.join(contestant.getHandle())
        self.solved = contestant.getProblemsSolved() 
        self.penalty = contestant.getPenalty()

    def __repr__(self):
        return '{' + self.handle + ', ' + \
                str(self.solved) + ', ' + \
                str(self.penalty/60) + '}'

class Contest(object):

    def __init__(self, handleList, problemSet):
        self.contestants = {
            ''.join(handle): Contestant(handle, problemSet) 
            for handle in handleList
        }
        self.problemList = list(problemSet)

    def apply(self, submition):
        self.contestants[submition.handle].apply(submition)
        return Result.OK

    def getScoreboard(self):
        return [ContestantScore(self.contestants[c]) for c in self.contestants]
