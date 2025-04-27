drop schema if exists ccca cascade;

create schema ccca;

create table ccca.account (
	account_id uuid,
	name text,
	email text,
	document text,
	password text,
	primary key (account_id)
);

insert into ccca.account(account_id, name, email, document, password) 
values (
	'1fb6e901-f4de-4653-80e7-07c207073f61', 'A B', 'a@b.com', '87465849004', '123ABCdef'
);

create table ccca.asset (
	asset_id uuid,
	ticker varchar(8),
	primary key (asset_id)
);

insert into ccca.asset(asset_id, ticker) values (
'9b9174a1-17ce-423e-9fef-0aa1dbd314de', 'BTC'
), (
'1c3d068e-c326-4ad1-9246-df2b84c393db', 'USD'
);

create table ccca.account_asset (
	account_id uuid,
	asset_id uuid,
	quantity decimal,
	foreign key (account_id) references ccca.account(account_id),
	foreign key (asset_id) references ccca.asset(asset_id)
);


insert into ccca.account_asset(account_id, asset_id, quantity) values (
'1fb6e901-f4de-4653-80e7-07c207073f61', '9b9174a1-17ce-423e-9fef-0aa1dbd314de', 100
);

create table ccca.order(
    order_id uuid,
	account_id uuid,
	asset_id uuid,
    asset_payment_id uuid,
    side varchar(10),
	quantity decimal,
    price decimal,
    primary key (order_id),
	foreign key (account_id) references ccca.account(account_id)
);