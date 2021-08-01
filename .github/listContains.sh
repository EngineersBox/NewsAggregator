#!/bin/bash

printExit() {
    echo $1
    exit 1
}

for value in $2; do
    [[ $1 =~ (^|[[:space:]])$value($|[[:space:]]) ]] || printExit "Invlid input: $value"
done