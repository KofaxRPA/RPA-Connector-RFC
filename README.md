# RPA-Connector-RFC
SAP RFC connector for Kofax RPA

## Overview

RFC connector is offering native SAP RFC (Remote Function Call) capability to Kofax RPA 11.
The connector can easily invoke many SAP remote function modules including BAPI modules and ABAP custom code.

## Features

-   Based on [node-rfc](https://github.com/SAP/node-rfc)
-   Server side and desktop side deployment supported
-   Automatic conversion between JSON and ABAP datatypes

## Supported platforms

-   Kofax RPA 11

## Prerequisites

-   SAP NW RFC SDK C++ binaries for Windows IA32 or Linux X64 must be downloaded (SAP partner or customer account required) and locally installed [SAP NW RFC SDK section on SAP Support Portal](https://support.sap.com/en/product/connectors/nwrfcsdk.html). Using the latest version is recommended.

## Installation

-	Unzip the SAP NW RFC SDK C++ binaries into a local directory
-	Add the lib folder of the SDK in the system PATH environment variable (Windows) or in the library path (Linux)

## Quick start

-	Copy the connector archive into the RPA project
-	Create a Custom Action step and select the 'sap rfc' connector
-	Bind the input and output fields

## Fields

### Input :

- jsonConnection : SAP connection parameters (JSON format)
- rfmName : name of remote function module to invoke
- jsonRequest : input structure of function (JSON format)

### Output :

- jsonResponse : output structure of function (JSON format)

## Running examples

- The "examples" directory is a Kofax RPA project
- Copy the RFC connector into the "examples" project (inside the "Library" folder)
- Open the "examples" project with RPA Design Studio
- Open the "Configure" snippet
- Edit the "rfcConnection" variable and set the initial values as needed
- Save the snippet
- Open Management Console and create a new password entry in the password store (use values entered in "rfcConnection" in order to fill the  "user name" and "target system" fields)
- Don't forget the create password access entries for your deployed robots and your Design Studio

Now you should be able to run the "Echo" robot
