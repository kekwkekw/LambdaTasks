let initQuery = `PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "Employees";
DROP TABLE IF EXISTS "Categories";
DROP TABLE IF EXISTS "Customers";
DROP TABLE IF EXISTS "Shippers";
DROP TABLE IF EXISTS "Supplies";
DROP TABLE IF EXISTS "Orders";
DROP TABLE IF EXISTS "Products";
DROP TABLE IF EXISTS "OrderDetails";
DROP TABLE IF EXISTS "Regions";
DROP TABLE IF EXISTS "Territories";
DROP TABLE IF EXISTS "EmployeeTerritories";
CREATE TABLE IF NOT EXISTS "Employees" ( "EmployeeID" INTEGER PRIMARY KEY, "LastName" VARCHAR(1000) NULL, "FirstName" VARCHAR(1000) NULL, "Title" VARCHAR(1000) NULL, "TitleOfCourtesy" VARCHAR(1000) NULL, "BirthDate" VARCHAR(1000) NULL, "HireDate" VARCHAR(1000) NULL, "Address" VARCHAR(1000) NULL, "City" VARCHAR(1000) NULL, "Region" VARCHAR(1000) NULL, "PostalCode" VARCHAR(1000) NULL, "Country" VARCHAR(1000) NULL, "HomePhone" VARCHAR(1000) NULL, "Extension" VARCHAR(1000) NULL, "Photo" BLOB NULL, "Notes" VARCHAR(1000) NULL, "ReportsTo" INTEGER NULL);
CREATE TABLE IF NOT EXISTS "Categories" ( "CategoryID" INTEGER PRIMARY KEY, "CategoryName" VARCHAR(1000) NULL, "Description" VARCHAR(1000) NULL);
CREATE TABLE IF NOT EXISTS "Customers" ( "CustomerID" VARCHAR(1000) PRIMARY KEY, "CompanyName" VARCHAR(1000) NULL, "ContactName" VARCHAR(1000) NULL, "ContactTitle" VARCHAR(1000) NULL, "Address" VARCHAR(1000) NULL, "City" VARCHAR(1000) NULL, "Region" VARCHAR(1000) NULL, "PostalCode" VARCHAR(1000) NULL, "Country" VARCHAR(1000) NULL, "Phone" VARCHAR(1000) NULL, "Fax" VARCHAR(1000) NULL);
CREATE TABLE IF NOT EXISTS "Shippers" ( "ShipperID" INTEGER PRIMARY KEY, "CompanyName" VARCHAR(1000) NULL, "Phone" VARCHAR(1000) NULL);
CREATE TABLE IF NOT EXISTS "Supplies" ( "SupplierID" INTEGER PRIMARY KEY, "CompanyName" VARCHAR(1000) NULL, "ContactName" VARCHAR(1000) NULL, "ContactTitle" VARCHAR(1000) NULL, "Address" VARCHAR(1000) NULL, "City" VARCHAR(1000) NULL, "Region" VARCHAR(1000) NULL, "PostalCode" VARCHAR(1000) NULL, "Country" VARCHAR(1000) NULL, "Phone" VARCHAR(1000) NULL, "Fax" VARCHAR(1000) NULL, "HomePage" VARCHAR(1000) NULL);
CREATE TABLE IF NOT EXISTS "Orders" ( "OrderID" INTEGER PRIMARY KEY, "CustomerID" VARCHAR(1000) NULL, "EmployeeID" INTEGER NOT NULL, "OrderDate" VARCHAR(1000) NULL, "RequiredDate" VARCHAR(1000) NULL, "ShippedDate" VARCHAR(1000) NULL, "ShipVia" INTEGER NULL, "Freight" DECIMAL NOT NULL, "ShipName" VARCHAR(1000) NULL, "ShipAddress" VARCHAR(1000) NULL, "ShipCity" VARCHAR(1000) NULL, "ShipRegion" VARCHAR(1000) NULL, "ShipPostalCode" VARCHAR(1000) NULL, "ShipCountry" VARCHAR(1000) NULL);
CREATE TABLE IF NOT EXISTS "Products" ( "ProductID" INTEGER PRIMARY KEY, "ProductName" VARCHAR(1000) NULL, "SupplierID" INTEGER NOT NULL, "CategoryID" INTEGER NOT NULL, "QuantityPerUnit" VARCHAR(1000) NULL, "UnitPrice" DECIMAL NOT NULL, "UnitsInStock" INTEGER NOT NULL, "UnitsOnOrder" INTEGER NOT NULL, "ReorderLevel" INTEGER NOT NULL, "Discontinued" INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS "OrderDetails" ( "OrderID" VARCHAR(1000), "ProductID" INTEGER NOT NULL, "UnitPrice" DECIMAL NOT NULL, "Quantity" INTEGER NOT NULL, "Discount" DOUBLE NOT NULL);
CREATE TABLE IF NOT EXISTS "Regions" ( "RegionID" INTEGER PRIMARY KEY, "RegionDescription" VARCHAR(1000) NULL);
CREATE TABLE IF NOT EXISTS "Territories" ( "TerritoryID" VARCHAR(1000) PRIMARY KEY, "TerritoryDescription" VARCHAR(1000) NULL, "RegionID" INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS "EmployeeTerritories" ("EmployeeID" INTEGER NOT NULL, "TerritoryID" VARCHAR(1000) NULL);`;

let getEmployees = `SELECT * FROM Employees;`;
let getCategories = `SELECT * FROM Categories;`;
let getCustomers = `SELECT * FROM Customers;`;
let getShippers = `SELECT * FROM Shippers;`;
let getSupplies = `SELECT * FROM Supplies;`;
let getOrders = `SELECT * FROM Orders;`;
let getProducts = `SELECT * FROM Products;`;
let getOrderDetails = `SELECT * FROM OrderDetails;`;
let getRegions = `SELECT * FROM Regions;`;
let getTerritories = `SELECT * FROM Territories;`;
let getEmployeeTerritories = `SELECT * FROM EmployeeTerritories;`;

export { initQuery, getEmployees, getCategories, getCustomers, getShippers, getSupplies, getOrders, getProducts, getOrderDetails, getRegions, getTerritories, getEmployeeTerritories };