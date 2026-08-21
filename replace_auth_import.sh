#!/bin/bash
sed -i 's/from "database\/schema"/from "..\/..\/..\/database\/schema"/g' src/app/actions/auth.ts
