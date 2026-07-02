const { createClient } = supabase;

const client = createClient(
    "https://ttfwbofyypbqmstpdswz.supabase.co",
    "sb_publishable_8KfS7ulRwPDoFTy-MjXBCg_f0jeXJQd"
);

const form = document.getElementById("loginForm");

form.addEventListener("submit", login);

// ======================
// LOGIN
// ======================

async function login(e){

    e.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const tombol = document.querySelector(".btn-login");

    tombol.disabled = true;

    tombol.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span>
        Loading...
    `;

    const { error } =
        await client.auth.signInWithPassword({

            email,
            password

        });

    if(error){

        Swal.fire({

            icon:"error",

            title:"Login Gagal",

            text:error.message

        });

        tombol.disabled = false;

        tombol.innerHTML = `
            <i class="bi bi-box-arrow-in-right"></i>
            Login
        `;

        return;

    }

    Swal.fire({

        icon:"success",

        title:"Berhasil",

        text:"Selamat datang!",

        timer:1200,

        showConfirmButton:false

    }).then(()=>{

        location.href="dashboard.html";

    });

}

// ======================
// SHOW PASSWORD
// ======================

const toggle = document.getElementById("togglePassword");

toggle.addEventListener("click",()=>{

    const password = document.getElementById("password");

    const icon = toggle.querySelector("i");

    if(password.type==="password"){

        password.type="text";

        icon.className="bi bi-eye-slash";

    }else{

        password.type="password";

        icon.className="bi bi-eye";

    }

});