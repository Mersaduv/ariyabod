<?php

return [
    'required' => 'فیلد :attribute الزامی است.',
    'email' => 'فرمت :attribute معتبر نیست.',
    'min' => [
        'string' => 'طول :attribute نباید کمتر از :min کاراکتر باشد.',
    ],
    'max' => [
        'string' => 'طول :attribute نباید بیشتر از :max کاراکتر باشد.',
    ],
    'confirmed' => 'تأییدیه‌ی :attribute مطابقت ندارد.',

    'attributes' => [
        'email' => 'ایمیل',
        'password' => 'رمز عبور',
        'name' => 'نام',
        'current_password' => 'رمز عبور فعلی',
    ],
    'custom' => [
        'current_password' => [
            'current_password' => 'رمز عبور فعلی اشتباه است.',
        ],
    ],
];
