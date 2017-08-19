---
tags: ["Java"]
excerpt: |
  This post provides a small example illustrating how to process csv files using BeanIO — 
  files containing (some) columns whose name is not known in advance.
---
[BeanIO](http://beanio.org/) provides a simple way to read a csv file whose columns and column datatypes are known at compile time. This may not always be the case at least for some columns.

## Use cases
Think of an application for processing data sets. Some columns might be fixed: id, timestamp, data always collected. Others depend on which sensory data is collected. Or consider an import-export function for customizable database application — where users can configure additional fields extending a predefined set.

## Approach
A simple approach would be storing each line as simple key-value-pairs, mapping column name to value. However an object with typed fields for already known columns (e.g. timestamps) would be much nicer. Validation and datatype conversion for known columns could be done by the framework during import and only _new_ columns (unknown at compile time) would have to be interpreted later.

In BeanIO this is possible using typehandlers. The basic idea is to have a class with typed fields for all known columns and a field with a map-like type for the remaining unknown columns, the type handler is then implemented such that it merges or extracts values properly.

## Sample project
This [project]({{site.url}}/assets/csvbeanio.zip) contains an example illustrating this approach. `CsvLine` stores the data of a single line, `GenericCsvEntries` stores the values of unknown columns from one line. `CsvLineFormat` helps creating readers and writers for the csv files. Depending on the column name custom type handlers are added. Each instance of `GenericCsvEntriesHandler` is responsible for a particular column.

The two test classes contain example code for reading and writing a csv file.

In the example only string values are stored. If the colums including their types are customizable, the `GenericCsvEntriesHandler` could be enhanced to produce typed values.