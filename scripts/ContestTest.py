import unittest
from contest import *
from contestant import *

class ContestUnitTest(unittest.TestCase):

    def setUp(self):
        self.handleList = ['hailo', 'curo']
        self.problemSet = ['p1', 'p2']
        self.p1_ac = Submition(
            handle = 'hailo', 
            problem = 'p1', 
            seconds = 100, 
            veredict = Veredict.ACCEPTED,
        )
        self.p2_wa = Submition(
            handle = 'hailo', 
            problem = 'p2', 
            seconds = 100, 
            veredict = Veredict.WRONG_ANSWER,
        )
        self.p2_ac = Submition(
            handle = 'hailo', 
            problem = 'p2', 
            seconds = 100, 
            veredict = Veredict.ACCEPTED,
        )
        self.p1_wa = Submition(
            handle = 'hailo', 
            problem = 'p1', 
            seconds = 100, 
            veredict = Veredict.WRONG_ANSWER,
        )

    def test_apply_submition(self):
        contest = Contest(self.handleList, self.problemSet)
        self.assertEqual(contest.apply(self.p1_ac), Result.OK)
        curo, hailo = contest.getScoreboard()
        self.assertEqual(curo.handle, 'curo')
        self.assertEqual(curo.solved, 0)
        self.assertEqual(curo.penalty, 0)
        self.assertEqual(hailo.handle, 'hailo')
        self.assertEqual(hailo.solved, 1)
        self.assertEqual(hailo.penalty, self.p1_ac.seconds)

    def test_contestant_submition(self):
        contestant = Contestant('hailo', self.problemSet)
        self.assertEqual(contestant.apply(self.p1_ac), Result.OK)

    def test_problem_creation(self):
        problem = Problem('p1')
        self.assertEqual(problem.getPenalty(), 0)
        self.assertEqual(problem.getStatus(), ProblemStatus.PENDING)

    def test_problem_1_try_1_ac(self):
        problem = Problem('p1')
        problem.apply(self.p1_ac)
        self.assertEqual(problem.getPenalty(), self.p1_ac.seconds)
        self.assertEqual(problem.getStatus(), ProblemStatus.DONE)

    def test_problem_2_try_no_ac(self):
        problem = Problem('p1')
        problem.apply(self.p1_wa)
        problem.apply(self.p1_wa)
        self.assertEqual(problem.getPenalty(), 2*Problem.PENALTY)
        self.assertEqual(problem.getStatus(), ProblemStatus.PENDING)

    def test_problem_2_try_2_ac(self):
        problem = Problem('p1')
        problem.apply(self.p1_wa)
        problem.apply(self.p1_ac)
        problem.apply(self.p1_wa)
        problem.apply(self.p1_ac)
        self.assertEqual(
            problem.getPenalty(), 
            Problem.PENALTY + self.p1_ac.seconds, 
        )
        self.assertEqual(problem.getStatus(), ProblemStatus.DONE)

    def test_contestant_2_ac_0_wa(self):
        contestant = Contestant('hailo', self.problemSet)
        contestant.apply(self.p1_ac)
        contestant.apply(self.p2_ac)
        contestant.apply(self.p1_ac)
        contestant.apply(self.p2_ac)
        self.assertEqual(contestant.getProblemsSolved(), 2)
        self.assertEqual(
            contestant.getPenalty(),
            self.p1_ac.seconds + self.p2_ac.seconds,
        );

    def test_contestant_1_ac_1_wa(self):
        contestant = Contestant('hailo', self.problemSet)
        contestant.apply(self.p1_ac)
        contestant.apply(self.p2_wa)
        self.assertEqual(contestant.getProblemsSolved(), 1)
        self.assertEqual(
            contestant.getPenalty(),
            self.p1_ac.seconds,
        );


if __name__ == '__main__':
    unittest.main(verbosity=2)
