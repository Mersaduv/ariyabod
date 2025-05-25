<?php

return [
    'required' => ':attribute باید حتمي وي.',
    'email' => ':attribute باید یو بااعتباره برېښنالیک وي.',
    'min' => [
        'string' => ':attribute باید لږ تر لږه :min توري ولري.',
    ],
    'max' => [
        'string' => ':attribute باید تر :max تورو زیات نه وي.',
    ],
    'confirmed' => 'د :attribute تایید سره سمون نه خوري.',

    'attributes' => [
        'email' => 'برېښنالیک',
        'password' => 'پاسورډ',
        'name' => 'نوم',
        'current_password' => 'اوسنی پاسورډ',
        'items.*.image' => 'د توکي انځور',
        'provinces' => 'ولایتونه',
    ],
    'custom' => [
        'current_password' => [
            'current_password' => 'اوسنی پاسورډ ناسم دی.',
        ],
    ],
];
