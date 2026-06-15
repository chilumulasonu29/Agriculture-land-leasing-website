CountLists(L, Ne, Nl):-
Count(L, 0, 0, Ne, Nl).
Count(CI, Ne, Nl, Ne, Nl).Count([H|T], Ne1, Nl1, Ne, Nl):-
H=[]:-
Ne2 is Ne1 + 1.
Nl2 is Nl1 + 1.
Ne2 is Ne1,
Nl2 is Nl1, Nl2, Ne, Nl)
),
Count(T, Ne2 (a,[]b, []), Ne,Nl).