import { expect, test } from '@playwright/test'

test('user can navigate to the registration form', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    await expect(page).toHaveTitle(/PrestaShop/)

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()

    await store.getByRole('link', { name: 'Create your account' }).click()

    await expect(store.getByLabel('First name')).toBeVisible()
})

test('registration form rejects empty submission', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()

    await store.getByRole('link', { name: 'Create your account' }).click()

    const firstName = store.getByLabel('First name')
    const lastName = store.getByLabel('Last name')
    const email = store.getByRole('textbox', { name: 'Email', exact: true })
    const password = store.getByRole('textbox', { name: 'Password' })
    const termsCheckbox = store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    })
    const privacyCheckbox = store.getByRole('checkbox', {
        name: 'Customer data privacy'
    })
    
    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(firstName).toBeFocused()

    await expect(firstName).toHaveJSProperty('validity.valueMissing', true)
    await expect(lastName).toHaveJSProperty('validity.valueMissing', true)
    await expect(email).toHaveJSProperty('validity.valueMissing', true)
    await expect(password).toHaveJSProperty('validity.valueMissing', true)

    await expect(termsCheckbox).not.toBeChecked()
    await expect(privacyCheckbox).not.toBeChecked()

    await expect(termsCheckbox).toHaveJSProperty('validity.valueMissing', true)
    await expect(privacyCheckbox).toHaveJSProperty('validity.valueMissing', true)
})

test('registration form requires each text field individually', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    const firstName = store.getByLabel('First name')
    const lastName = store.getByLabel('Last name')
    const email = store.getByRole('textbox', { name: 'Email', exact: true })
    const password = store.getByRole('textbox', { name: 'Password' })
    const termsCheckbox = store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    })
    const privacyCheckbox = store.getByRole('checkbox', {
        name: 'Customer data privacy'
    })

    const fields = [
        { name: 'First name', locator: firstName },
        { name: 'Last name', locator: lastName },
        { name: 'Email', locator: email },
        { name: 'Password', locator: password }
    ]

    for (const field of fields) {
        await firstName.fill('Nemanja')
        await lastName.fill('Nikolic')
        await email.fill('nemanja.required.test@gmail.com')
        await password.fill('Strongpassword123!')

        await termsCheckbox.check()
        await privacyCheckbox.check()

        await field.locator.clear()

        await store.getByRole('button', { name: 'Create account' }).click()

        await expect(field.locator).toBeFocused()
        await expect(field.locator).toHaveJSProperty(
            'validity.valueMissing',
            true
        )
    }
})

test('registration form requires each checkbox individually', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    const firstName = store.getByLabel('First name')
    const lastName = store.getByLabel('Last name')
    const email = store.getByRole('textbox', { name: 'Email', exact: true })
    const password = store.getByRole('textbox', { name: 'Password' })
    const termsCheckbox = store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    })
    const privacyCheckbox = store.getByRole('checkbox', {
        name: 'Customer data privacy'
    })

    await firstName.fill('Nemanja')
    await lastName.fill('Nikolic')
    await email.fill('nemanja.required.test@gmail.com')
    await password.fill('Strongpassword123!')

    await privacyCheckbox.check()

    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(termsCheckbox).not.toBeChecked()
    await expect(termsCheckbox).toHaveJSProperty(
        'validity.valueMissing',
        true
    )

    await termsCheckbox.check()
    await privacyCheckbox.uncheck()

    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(privacyCheckbox).not.toBeChecked()
    await expect(privacyCheckbox).toHaveJSProperty(
        'validity.valueMissing',
        true
    )
})

test('registration form validates invalid email formats', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()

    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Nemanja')
    await store.getByLabel('Last name').fill('Nikolic')
    await store.getByRole('textbox', { name: 'Password' }).fill('Strongpassword123!')
    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()
    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    const email = store.getByRole('textbox', { name: 'Email', exact: true })

    const invalidEmails = [
        'nemanja',
        'nemanja@',
        '@gmail.com',
        'nemanja@gmail.',
        'nemanja@.gmail.com',
        'nemanja@@gmail.com',
        'ne manja@gmail.com',
        'nemanja @gmail.com',
        'nemanja@ gmail.com',
        'nemanja@g mail.com'
    ]

    for (const invalidEmail of invalidEmails) {
        await email.fill(invalidEmail)

        await store.getByRole('button', { name: 'Create account' }).click()

        await expect(email).toBeFocused()
        await expect(email).toHaveJSProperty('validity.typeMismatch', true)
    }

    await email.fill('nemanja@gmail.com')
    await expect(email).toHaveJSProperty('validity.typeMismatch', false)
})

test('registration form enforces password length limits', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Nemanja')
    await store.getByLabel('Last name').fill('Nikolic')
    await store.getByRole('textbox', { name: 'Email', exact: true }).fill('nemanja@gmail.com')
    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()
    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    const password = store.getByRole('textbox', { name: 'Password' })

    await password.fill('Ab1!')
    await expect(password).toHaveJSProperty('validity.tooShort', true)
    
    await password.fill('A'.repeat(73))
    await expect(password).toHaveJSProperty('value.length', 72)
})

test('registration form identifies password strength', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Nemanja')
    await store.getByLabel('Last name').fill('Nikolic')

    await store.getByRole('textbox', { name: 'Email', exact: true })
        .fill(`weak.${Date.now()}@example.com`)

    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()

    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    const password = store.getByRole('textbox', { name: 'Password' })

    const passwordMessage = store.locator(
        '[data-ps-target="password-announce-validity"]'
    )

    await password.fill('password')

    await expect(passwordMessage)
        .toHaveText('Your password is too weak')

    await password.fill('NemanjaStrong123!')

    await expect(passwordMessage)
        .toHaveText('Your password is valid')
})

test('user can successfully register an account', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Test')
    await store.getByLabel('Last name').fill('User')

    const email = `test.${Date.now()}@example.com`

    await store.getByRole('textbox', { name: 'Email', exact: true })
        .fill(email)

    await store.getByRole('textbox', { name: 'Password' })
        .fill('StrongPassword123!')

    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()

    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(
        store.getByText('Test User', { exact: true })
    ).toBeVisible()
})

test('user can successfully register with a valid birthdate', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Test')
    await store.getByLabel('Last name').fill('User')
    await store.getByLabel('Birthdate').fill('05/31/1997')

    const email = `test.${Date.now()}@example.com`

    await store.getByRole('textbox', { name: 'Email', exact: true })
        .fill(email)

    await store.getByRole('textbox', { name: 'Password' })
        .fill('StrongPassword123!')

    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()

    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(
        store.getByText('Test User', { exact: true })
    ).toBeVisible()
})

test('registration form rejects an already registered email', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Test')
    await store.getByLabel('Last name').fill('User')

    const email = `test.${Date.now()}@example.com`

    await store.getByRole('textbox', { name: 'Email', exact: true })
        .fill(email)

    await store.getByRole('textbox', { name: 'Password' })
        .fill('StrongPassword123!')

    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()

    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(
        store.getByText('Test User', { exact: true })
    ).toBeVisible()

    await store.getByText('Test User', { exact: true }).click()
    await store.getByText('Sign out', { exact: true }).click()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Test')
    await store.getByLabel('Last name').fill('User')

    await store.getByRole('textbox', { name: 'Email', exact: true })
        .fill(email)

    await store.getByRole('textbox', { name: 'Password' })
        .fill('StrongPassword123!')

    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()

    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(
        store.getByText(
            'The email is already used, please choose another one or sign in',
            { exact: true }
        )
    ).toBeVisible()
})

test('registration form rejects invalid first name', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Nemanja123')
    await store.getByLabel('Last name').fill('Nikolic')
    await store.getByLabel('Birthdate').fill('05/31/1997')

    await store.getByRole('textbox', { name: 'Email', exact: true })
        .fill(`first.${Date.now()}@example.com`)

    await store.getByRole('textbox', { name: 'Password' })
        .fill('StrongPassword123!')

    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()

    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(store.getByText('Invalid format.', { exact: true }))
        .toBeVisible()
})

test('registration form rejects invalid last name', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Nemanja')
    await store.getByLabel('Last name').fill('Nikolic123')
    await store.getByLabel('Birthdate').fill('05/31/1997')

    await store.getByRole('textbox', { name: 'Email', exact: true })
        .fill(`first.${Date.now()}@example.com`)

    await store.getByRole('textbox', { name: 'Password' })
        .fill('StrongPassword123!')

    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()

    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(store.getByText('Invalid format.', { exact: true }))
        .toBeVisible()
})

test('registration form rejects invalid birthdate', async ({ page }) => {
    await page.goto('https://demo.prestashop.com/')

    const store = page.locator('iframe[name=framelive]').contentFrame()

    await store.getByLabel('Sign in').click()
    await store.getByRole('link', { name: 'Create your account' }).click()

    await store.getByLabel('First name').fill('Nemanja')
    await store.getByLabel('Last name').fill('Nikolic')
    await store.getByLabel('Birthdate').fill('dfdfdf')

    await store.getByRole('textbox', { name: 'Email', exact: true })
        .fill(`first.${Date.now()}@example.com`)

    await store.getByRole('textbox', { name: 'Password' })
        .fill('StrongPassword123!')

    await store.getByRole('checkbox', {
        name: /terms and conditions and the privacy policy/
    }).check()

    await store.getByRole('checkbox', {
        name: 'Customer data privacy'
    }).check()

    await store.getByRole('button', { name: 'Create account' }).click()

    await expect(store.getByText('Format should be 05/31/1970.', { exact: true }))
        .toBeVisible()
})