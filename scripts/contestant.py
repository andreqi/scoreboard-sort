class Result:
    OK = 1
    RTE = 2

class Veredict(object):
    ACCEPTED = 1
    WRONG_ANSWER = 2

    @classmethod
    def getVeredict(cls, veredict):
        if veredict == 'Accepted':
            return cls.ACCEPTED
        else:
            return cls.WRONG_ANSWER

class Submition(object):
    def __init__(self,
                 problem, 
                 handle,
                 seconds,
                 veredict,
                ):
        self.problem = ''.join(problem)
        self.handle = ''.join(handle)
        self.seconds = seconds
        self.veredict = veredict
    def __repr__(self):
        return 'Submition[' + self.handle + ', ' + \
                self.problem + ', ' + \
                str(self.seconds) + ', ' + \
                str(self.veredict) + ']'


class ProblemStatus:
    DONE = 1
    PENDING = 2

class Problem(object):

    PENALTY = 20 * 60
     
    def __init__(self, problemId):
        self.problemId = ''.join(problemId)
        self.status = ProblemStatus.PENDING 
        self.solvedTime = 0
        self.penalty = 0

    def apply(self, submition):
        if self.status == ProblemStatus.DONE:
            return Result.OK
        veredict = submition.veredict
        if veredict == Veredict.ACCEPTED:
            self.status = ProblemStatus.DONE
            self.solvedTime = submition.seconds    
            self.penalty += submition.seconds
        else:     
            self.penalty += self.PENALTY
        return Result.OK

    def getStatus(self):
        return self.status

    def getPenalty(self):
        return self.penalty

class Contestant(object):

    def __init__(self, handle, problemSet):
        self.problemSet = {
            ''.join(problem): Problem(problem)
            for problem in problemSet
        }
        self.solved = 0
        self.penalty = 0
        self.handle = handle

    def apply(self, submition):
        problem = self.problemSet[submition.problem]
        if problem.getStatus() == ProblemStatus.DONE:
            return Result.OK

        problem.apply(submition)

        if problem.getStatus() == ProblemStatus.DONE:
            self.solved += 1
            self.penalty += problem.getPenalty()

        return Result.OK

    def getHandle(self):
        return self.handle

    def getProblemsSolved(self):
        return self.solved

    def getPenalty(self):
        return self.penalty
