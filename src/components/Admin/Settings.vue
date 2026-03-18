<template>
    <div class="settings-view">
        <div class="settings-card">
            <div class="settings-section">
                <h3>Platforma sozlamalari</h3>
                <p class="text-muted">Asosiy platforma ma'lumotlarini boshqaring</p>

                <div class="settings-grid mt-4">
                    <div class="input-block">
                        <label>Platforma nomi</label>
                        <input type="text" value="IsoUz LMS" class="form-control" />
                    </div>
                    <div class="input-block">
                        <label>Admin Email</label>
                        <input type="email" value="admin@isouz.uz" class="form-control" />
                    </div>
                    <div class="input-block">
                        <label>Til</label>
                        <select class="form-select">
                            <option>O'zbek tili</option>
                            <option>English</option>
                            <option>Russian</option>
                        </select>
                    </div>
                    <div class="input-block">
                        <label>Vaqt zonasi</label>
                        <select class="form-select">
                            <option>Tashkent (GMT+5)</option>
                            <option>UTC</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="settings-section border-top mt-5 pt-4">
                <h3>Xavfsizlik</h3>
                <p class="text-muted">Parolni yangilash</p>

                <div class="settings-grid mt-4">
                    <div class="input-block">
                        <label>Hozirgi parol</label>
                        <input type="password" class="form-control" />
                    </div>
                    <div class="input-block">
                        <label>Yangi parol</label>
                        <input type="password" class="form-control" />
                    </div>
                </div>

                <button class="btn btn-primary mt-4">O'zgarishlarni saqlash</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings-card {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.settings-section h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.input-block label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 8px;
}

.form-control,
.form-select {
    border-radius: 10px;
    padding: 10px 15px;
    border: 1px solid #e2e8f0;
}

.form-control:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
}
</style>
