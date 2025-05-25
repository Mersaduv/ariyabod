<?php

return [
    'required' => 'The :attribute field is required.',
    'email' => 'The :attribute must be a valid email address.',
    'min' => [
        'string' => 'The :attribute must be at least :min characters.',
    ],
    'max' => [
        'string' => 'The :attribute may not be greater than :max characters.',
    ],
    'confirmed' => 'The :attribute confirmation does not match.',

    'attributes' => [
        'email' => 'email address',
        'password' => 'password',
        'name' => 'name',
        'current_password' => 'current password',
        'items.*.image' => 'item image',
        'provinces' => 'province',
    ],
    'custom' => [
        'current_password' => [
            'current_password' => 'The current password is incorrect.',
        ],
    ],
];
