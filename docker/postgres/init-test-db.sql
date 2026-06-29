SELECT 'CREATE DATABASE ticket_flow_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ticket_flow_test')\gexec