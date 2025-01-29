-- Test admin login (PIN: 1234)
SELECT authenticate_staff('1234');

-- Test manager login (PIN: 5678)
SELECT authenticate_staff('5678');

-- Test staff login (PIN: 9012)
SELECT authenticate_staff('9012');

-- Test staff 2 login (PIN: 3456)
SELECT authenticate_staff('3456');

-- Test invalid login
SELECT authenticate_staff('0000'); 