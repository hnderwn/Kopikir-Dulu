#!/bin/bash

names=(
"Arabica Gayo Washed"
"Arabica Gayo Honey"
"Arabica Kintamani Washed"
"Arabica Kintamani Honey"
"Arabica Toraja Washed"
"Arabica Toraja Natural"
"Arabica Flores Bajawa"
"Arabica Papua Wamena"
"Arabica Java Preanger"
"Arabica Atu Lintang"
"Robusta Lampung"
"Robusta Temanggung"
"Robusta Bengkulu"
"Robusta Sidikalang"
"Robusta Karo"
"Robusta Toraja"
"Robusta Bali"
"Robusta Gayo"
"Robusta Flores"
"Robusta Papua"
)

for n in "${names[@]}"; do
    folder=$(echo "$n" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')
    mkdir -p "$folder"
    echo "Created: $folder"
done
